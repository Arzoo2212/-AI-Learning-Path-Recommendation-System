using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AI_Course_Recommendation_System.Models
{
    public class UserActivityLog
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(20)]
        public string ActivityType { get; set; } = string.Empty; // started | completed | achievement

        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        public DateTime ActivityDate { get; set; } = DateTime.UtcNow;

        public int? RelatedCourseId { get; set; }

        public int? RelatedPathId { get; set; }

        // Navigation properties
        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;

        [ForeignKey("RelatedPathId")]
        public virtual LearningPath? LearningPath { get; set; }

        [ForeignKey("RelatedCourseId")]
        public virtual Course? Course { get; set; }
    }
}
