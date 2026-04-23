using System.ComponentModel.DataAnnotations;

namespace AI_Course_Recommendation_System.Models
{
    public class UserSkill
    {
        [Key]
       
        public int Id { get; set; }
        [Required]
        [Range(1,5)]
        public int CurrentLevel { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }

        public int SkillId { get; set; }
        public Skill? Skill { get; set; }
    }
}
