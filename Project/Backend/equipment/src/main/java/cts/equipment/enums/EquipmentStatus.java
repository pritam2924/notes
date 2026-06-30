package cts.equipment.enums;

public enum EquipmentStatus {
    INSTALLED("Installed"),
    OPERATIONAL("Operational"),
    MAINTENANCE("Maintenance"),
    DECOMMISSIONED("Decommissioned");
    
    private final String displayName;
    
    EquipmentStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public static EquipmentStatus fromString(String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Equipment status cannot be null or empty");
        }
        for (EquipmentStatus equipmentStatus : EquipmentStatus.values()) {
            if (equipmentStatus.displayName.equalsIgnoreCase(status.trim())) {
                return equipmentStatus;
            }
        }
        throw new IllegalArgumentException("Invalid equipment status: " + status);
    }
}