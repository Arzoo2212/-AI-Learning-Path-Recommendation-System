namespace AI_Course_Recommendation_System.DTO.Progress
{
    public class LearningPathDTO
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string TargetRole { get; set; } = string.Empty;
        public int TotalHours { get; set; }
        public int CompletionPercent { get; set; }
        public List<LearningPathCourseDTO> Courses { get; set; } = new();
    }
}
