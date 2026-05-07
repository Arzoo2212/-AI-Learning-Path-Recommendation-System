using System.ComponentModel.DataAnnotations;

namespace AI_Course_Recommendation_System.Models
{
    public class Course
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string ThumbnailUrl { get; set; } = string.Empty;

        public string Provider { get; set; } = string.Empty;

        public string Category { get; set; } = string.Empty;

        public string SkillName { get; set; } = string.Empty;

        public string Url { get; set; } = string.Empty;

        public string Level { get; set; } = string.Empty;

        public int DurationHours { get; set; }

        public double Rating { get; set; }

        public int EnrolledCount { get; set; }

        public string Tags { get; set; } = string.Empty;
    }
}