import React, { useEffect, useMemo, useState } from "react";
import equipmentService from "../../../services/equipmentService";
import performanceMetricsService from "../../../services/performanceMetricsService";

/** Category → metrics mapping (matches your database.json categories)
 *  Use decoded labels here (no HTML entities).
 */
const CATEGORY_METRICS = {
  Mechanical: ["temperature", "load", "vibration"],
  Electrical: ["temperature", "load"],
  Instrumentation: ["temperature"],
  Automation: ["temperature", "load"],
  "Heating & Cooling": ["temperature", "load"],
  "Safety & Utilization": ["temperature"],
};

/** Labels, units, and ranges */
const METRIC_LABELS = {
  temperature: {
    label: "Temperature",
    unit: "°C",
    min: -50,
    max: 200,
    step: 0.1,
  },
  load: { label: "Load", unit: "%", min: 0, max: 150, step: 1 },
  vibration: { label: "Vibration", unit: "mm/s", min: 0, max: 50, step: 0.01 },
};

/** Thresholds for live warning/critical indicators */
const THRESHOLDS = {
  temperature: { warning: 85, critical: 95 },
  load: { warning: 90, critical: 100 },
  vibration: { warning: 5, critical: 7 },
};

function decodeCategory(cat) {
  // Normalize common HTML entity encodings to plain text.
  const s = String(cat ?? "");
  return s
    .replaceAll("&amp;amp;amp;", "&")
    .replaceAll("&amp;amp;", "&")
    .replaceAll("&amp;", "&");
}

function getLevel(metricKey, value) {
  const t = THRESHOLDS[metricKey];
  if (!t || value === "" || value == null || Number.isNaN(Number(value)))
    return "normal";
  const v = Number(value);
  if (v > t.critical) return "critical";
  if (v > t.warning) return "warning";
  return "normal";
}

// Helpers to get local date/time strings (not from UTC ISO slice)
function pad(n) {
  return String(n).padStart(2, "0");
}
function getLocalDateStr(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function getLocalTimeStr(d = new Date()) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Combine date + time (local) into UTC ISO string for storage */
function toISOFromParts(dateStr, timeStr) {
  const local = new Date(`${dateStr}T${timeStr}`);
  const utcISO = new Date(
    local.getTime() - local.getTimezoneOffset() * 60000
  ).toISOString();
  return utcISO;
}

export default function PerformanceMetrics() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const [metricsValues, setMetricsValues] = useState({});
  const [notes, setNotes] = useState("");

  const [datePart, setDatePart] = useState(() => getLocalDateStr());
  const [timePart, setTimePart] = useState(() => getLocalTimeStr());

  const [loadingEquip, setLoadingEquip] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState(null); // "success" | "danger" | null

  // Optional: equipment search query (filters dropdown + helps in empty state)
  const [equipmentQuery, setEquipmentQuery] = useState("");

  // 1) Load equipment list
  useEffect(() => {
    (async () => {
      try {
        setLoadingEquip(true);
        const data = await equipmentService.getAllEquipment();
        setEquipmentList(data);
      } catch (err) {
        console.error(err);
        setMessage("Could not load equipment from backend API.");
        setAlertType("danger");
      } finally {
        setLoadingEquip(false);
      }
    })();
  }, []);

  // Filtered equipment for search
  const filteredEquipment = useMemo(() => {
    const q = equipmentQuery.trim().toLowerCase();
    if (!q) return equipmentList;
    return equipmentList.filter((e) => {
      const name = (e.equipmentName || "").toLowerCase();
      const id = String(e.equipmentId || "").toLowerCase();
      return name.includes(q) || id.includes(q);
    });
  }, [equipmentQuery, equipmentList]);

  // 2) Set selected equipment by business ID (equipmentId)
  useEffect(() => {
    const eq = equipmentList.find((e) => e.equipmentId === selectedEquipmentId);
    setSelectedEquipment(eq || null);
  }, [selectedEquipmentId, equipmentList]);

  // 3) Applicable metrics from category (use decoded value)
  const applicableMetrics = useMemo(() => {
    const catRaw = selectedEquipment?.category;
    const cat = decodeCategory(catRaw);
    if (!cat) return [];
    return CATEGORY_METRICS[cat] || [];
  }, [selectedEquipment]);

  // 4) Reset metrics on category change (preserve existing values if still applicable)
  useEffect(() => {
    const next = {};
    applicableMetrics.forEach((m) => {
      next[m] = metricsValues[m] ?? "";
    });
    setMetricsValues(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicableMetrics]);

  function handleMetricChange(metricKey, value) {
    setMetricsValues((prev) => ({ ...prev, [metricKey]: value }));
  }

  // 5) Validation: require all applicable metric values + date + time
  const isFormValid = useMemo(() => {
    if (!selectedEquipment) return false;
    for (const m of applicableMetrics) {
      const v = metricsValues[m];
      if (v === "" || v === null) return false;
      const num = Number(v);
      if (Number.isNaN(num)) return false;
      const { min, max } = METRIC_LABELS[m];
      if (num < min || num > max) return false;
    }
    return Boolean(datePart) && Boolean(timePart);
  }, [selectedEquipment, applicableMetrics, metricsValues, datePart, timePart]);

  // 6) Save under equipment.performanceMetrics[] + alert evaluation
  async function handleSave(e) {
    e.preventDefault();
    if (!isFormValid || !selectedEquipment) return;

    setSaving(true);
    setMessage("");
    setAlertType(null);

    try {
      const entry = {
        equipmentId: selectedEquipment.equipmentId,
        timestamp: toISOFromParts(datePart, timePart),
        category: selectedEquipment.category,
        temperature: applicableMetrics.includes('temperature') ? Number(metricsValues.temperature) : null,
        loadPercentage: applicableMetrics.includes('load') ? Number(metricsValues.load) : null,
        vibration: applicableMetrics.includes('vibration') ? Number(metricsValues.vibration) : null,
        notes: notes?.trim() || null,
      };

      // Save using backend API
      await performanceMetricsService.savePerformanceMetric(entry);

      // ✅ UI success for operator save
      setMessage(
        `Saved metrics (${applicableMetrics.join(", ")}) for ${
          selectedEquipment.equipmentName
        }.`
      );
      setAlertType("success");

      // Reset inputs (keep selection)
      setMetricsValues({});
      setDatePart(getLocalDateStr());
      setTimePart(getLocalTimeStr());
      setNotes("");
    } catch (err) {
      console.error(err);
      setMessage(`Could not save metrics: ${err.message}`);
      setAlertType("danger");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container my-4">
      <h2 className="text-center fs-1 fw-bold text-dark mb-3">Performance Metrics</h2>

      {/* Alert message */}
      {message && (
        <div
          className={`alert alert-${
            alertType ?? "secondary"
          } d-flex align-items-center`}
          role="alert"
        >
          <div>{message}</div>
        </div>
      )}

      {/* Equipment selection (with optional search) */}
      <div className="card mb-3">
        <div className="card-body">
          <label htmlFor="equipment-select" className="form-label fw-semibold">
            Equipment
          </label>

          {loadingEquip ? (
            <div className="d-flex align-items-center gap-2">
              <div className="spinner-border spinner-border-sm" role="status" />
              <span>Loading equipment…</span>
            </div>
          ) : (
            <select
              id="equipment-select"
              className="form-select"
              value={selectedEquipmentId}
              onChange={(e) => setSelectedEquipmentId(e.target.value)}
            >
              <option value="">-- Select equipment --</option>
              {filteredEquipment.length === 0 ? (
                <option value="" disabled>
                  No matches for “{equipmentQuery}”
                </option>
              ) : (
                filteredEquipment.map((e) => (
                  <option key={e.equipmentId} value={e.equipmentId}>
                    {e.equipmentName ?? "(Unnamed)"} — {e.equipmentId}
                  </option>
                ))
              )}
            </select>
          )}
        </div>
      </div>

      {/* 🔹 Empty state (illustration + message) */}
      {!selectedEquipment && !loadingEquip && (
        <div className="card mb-4 empty-state">
          <div className="card-body py-5">
            <div className="d-flex flex-column align-items-center text-center">
              <p className="text-muted mb-4">
                Select an equipment to update the performance metrics.
              </p>
              <img
                src={"/src/assets/undraw_charts_lvf9.svg"}
                alt="Analytics overview illustration"
                className="illustration mb-4"
                style={{ maxWidth: 360, width: "100%" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Selected equipment details (big cards, evenly spread) */}
      {selectedEquipment && (
        <div className="row g-3 mb-3 align-items-stretch">
          {/* Equipment ID card */}
          <div className="col-12 col-md-6">
            <div className="card card-info h-100">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="text-muted mb-2">Equipment ID</h6>
                </div>
                <h6 className="mb-0 fw-semibold">
                  {selectedEquipment.equipmentId}
                </h6>
              </div>
            </div>
          </div>

          {/* Category card */}
          <div className="col-12 col-md-6">
            <div className="card card-info h-100">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <h6 className="text-muted mb-2">Category</h6>
                </div>
                <h6 className="mb-0 fw-semibold">
                  {decodeCategory(selectedEquipment.category)}
                </h6>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metrics form */}
      {selectedEquipment && (
        <form onSubmit={handleSave}>
          <div className="card mb-3">
            <div className="card-header fw-semibold">Enter Metrics</div>
            <div className="card-body">
              {/* Metric inputs */}
              {applicableMetrics.length === 0 ? (
                <p className="text-muted mb-0">
                  No metrics defined for category:{" "}
                  {decodeCategory(selectedEquipment.category)}
                </p>
              ) : (
                <div className="row g-3">
                  {applicableMetrics.map((m) => {
                    const cfg = METRIC_LABELS[m];
                    const level = getLevel(m, metricsValues[m]);

                    // Bootstrap subtle color mapping:
                    const levelBadgeClass =
                      level === "critical"
                        ? "badge bg-danger-subtle text-danger"
                        : level === "warning"
                        ? "badge bg-warning-subtle text-warning"
                        : "badge bg-success-subtle text-success";

                    const inputClass =
                      "form-control " +
                      (level === "critical"
                        ? "bg-danger-subtle"
                        : level === "warning"
                        ? "bg-warning-subtle"
                        : "bg-success-subtle");

                    return (
                      <div className="col-md-4" key={m}>
                        <label
                          htmlFor={`metric-${m}`}
                          className="form-label fw-semibold"
                        >
                          {cfg.label} ({cfg.unit})
                        </label>
                        <div className="input-group">
                          <input
                            id={`metric-${m}`}
                            type="number"
                            className={inputClass}
                            value={metricsValues[m] ?? ""}
                            onChange={(e) =>
                              handleMetricChange(m, e.target.value)
                            }
                            min={cfg.min}
                            max={cfg.max}
                            step={cfg.step}
                            placeholder={
                              m === "temperature"
                                ? "e.g., 70.0"
                                : m === "load"
                                ? "e.g., 60"
                                : "e.g., 1.2"
                            }
                            required
                          />
                          <span
                            className={`input-group-text ${levelBadgeClass}`}
                          >
                            {level.toUpperCase()}
                          </span>
                        </div>

                        <small style={{ marginLeft: 8 }}>
                          Range: {cfg.min} – {cfg.max}
                          {cfg.unit}
                        </small>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Date & Time (side-by-side) */}
              <div className="mt-3">
                <div className="row g-3 align-items-end">
                  <div className="col-12 col-md-6">
                    <label
                      htmlFor="metrics-date"
                      className="form-label fw-semibold"
                    >
                      Date
                    </label>
                    <input
                      id="metrics-date"
                      type="date"
                      className="form-control"
                      value={datePart}
                      onChange={(e) => setDatePart(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label
                      htmlFor="metrics-time"
                      className="form-label fw-semibold"
                    >
                      Time
                    </label>
                    <input
                      id="metrics-time"
                      type="time"
                      className="form-control"
                      value={timePart}
                      onChange={(e) => setTimePart(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mt-3">
                <label
                  htmlFor="metrics-notes"
                  className="form-label fw-semibold"
                >
                  Notes (optional)
                </label>
                <textarea
                  id="metrics-notes"
                  className="form-control"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Observations, anomalies, ambient conditions, etc."
                />
              </div>
            </div>

            <div className="card-footer d-flex justify-content-end">
              <button
                type="submit"
                className="btn"
                disabled={!isFormValid || saving}
                style={{
                  backgroundColor: "var(--primary-color)",
                  borderColor: "var(--primary-color)",
                  color: "white",
                }}
              >
                {saving && (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                )}
                Save Metrics
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Recent logs - removed since using backend API */}
    </div>
  );
}
