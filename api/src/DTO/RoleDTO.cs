

using System.ComponentModel.DataAnnotations;

namespace AI_Course_Recommendation_System.DTO
{
    public class RoleDTO
    {
        [Required]
        public required string Name { get; set; }
    }
}
