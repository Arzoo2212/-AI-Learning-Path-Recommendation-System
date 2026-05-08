using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AI_Course_Recommendation_System.Models
{
    public class UserCourseEnrollment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int CourseId { get; set; }

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "not-started";

        public DateTime EnrolledDate { get; set; } = DateTime.UtcNow;

        public DateTime? StartedDate { get; set; }

        public DateTime? CompletedDate { get; set; }
        [Range(0, 100)]

        public int ProgressPercent { get; set; } = 0;

        // Navigation Properties

        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;

        [ForeignKey("CourseId")]
        public virtual Course Course { get; set; } = null!;
    }
}
