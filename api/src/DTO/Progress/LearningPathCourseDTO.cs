namespace AI_Course_Recommendation_System.DTO.Progress
{
    public class LearningPathCourseDTO
    {
        public CourseDTO Course { get; set; } = null!;
        public int Order { get; set; }
        public string Status { get; set; } = "not-started";
        public DateTime? CompletedDate { get; set; }
    }
}
