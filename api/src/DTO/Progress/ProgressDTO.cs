namespace AI_Course_Recommendation_System.DTO.Progress
{
    public class ProgressDTO
    {
        public int UserId { get; set; }
        public int TotalCoursesEnrolled { get; set; }
        public int TotalCoursesCompleted { get; set; }
        public double TotalHoursLearned { get; set; }
        public int CurrentStreak { get; set; }
        public List<WeeklyActivityDTO> WeeklyActivity { get; set; } = new();
        public List<ActivityItemDTO> RecentActivity { get; set; } = new();
    }
}
