using System.ComponentModel.DataAnnotations;

namespace AI_Course_Recommendation_System.Models
{
    public class Role
    {
        [Key]
       
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;
        public List<RoleSkill> RoleSkills { get; set; } = [];
    }
}
