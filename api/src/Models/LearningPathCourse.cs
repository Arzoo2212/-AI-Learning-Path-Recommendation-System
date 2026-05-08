using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AI_Course_Recommendation_System.Models
{
    public class LearningPathCourse
    {

        [Key]
        public int Id { get; set; }

        [Required]
        public int LearningPathId { get; set; }

        [Required]
        public int CourseId { get; set; }

        public int OrderIndex { get; set; }

        // Navigation properties
        [ForeignKey("LearningPathId")]
        public virtual LearningPath LearningPath { get; set; } = null!;

        [ForeignKey("CourseId")]
        public virtual Course Course { get; set; } = null!;
    }
}
