namespace AI_Course_Recommendation_System.DTO.Progress
{
    public class EnrollCourseResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public int EnrollmentId { get; set; }
    }
}
