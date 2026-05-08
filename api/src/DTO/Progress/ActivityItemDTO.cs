namespace AI_Course_Recommendation_System.DTO.Progress
{
    public class ActivityItemDTO
    {
        public DateTime Date { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // started | completed | achievement
    }
}
