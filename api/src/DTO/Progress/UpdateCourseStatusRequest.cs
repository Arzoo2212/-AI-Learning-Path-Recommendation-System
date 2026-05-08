namespace AI_Course_Recommendation_System.DTO.Progress
{
    public class UpdateCourseStatusRequest
    {
        public int UserId { get; set; }
        public int CourseId { get; set; }
        public string Status { get; set; } = string.Empty; // not-started | in-progress | completed
    }
}
