package com.csit321G3G4.ByteBusters.Kasalig_bAI.dto;

import java.util.List;
import java.util.Map;

/** Class dashboard data: every enrolled student's latest mastery of every topic in a course. */
public record CourseHeatmap(int courseId, String courseTitle, List<TopicColumn> topics, List<StudentRow> students) {

    public record TopicColumn(int topicId, String title) {
    }

    /** masteryByTopicId maps topicId to a 0-100 mastery. A topic the student has not been assessed on has no entry. */
    public record StudentRow(int studentId, String fullName, Map<Integer, Float> masteryByTopicId) {
    }
}
