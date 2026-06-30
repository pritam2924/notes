package com.equiptrack.downtime_trend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ReportSubmissionRequest {

    @NotBlank(message = "Title is mandatory")
    @Size(min = 5, max = 100, message = "Title must be between 5 and 100 characters")
    private String title;

    @NotBlank(message = "Summary is mandatory")
    @Size(max = 500, message = "Summary cannot be more than 500 characters")
    private String summary;

    private String recommendations;

    @NotBlank(message = "Priority is mandatory")
    private String priority;

    @NotBlank(message = "Type is mandatory")
    private String type;

    @NotBlank(message = "SubmittedBy is mandatory")
    private String submittedBy;

    private Object data;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public String getRecommendations() { return recommendations; }
    public void setRecommendations(String recommendations) { this.recommendations = recommendations; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getSubmittedBy() { return submittedBy; }
    public void setSubmittedBy(String submittedBy) { this.submittedBy = submittedBy; }
    public Object getData() { return data; }
    public void setData(Object data) { this.data = data; }
}