using Microsoft.EntityFrameworkCore;

namespace AI_Course_Recommendation_System.Data
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
    {
            public DbSet<Models.User> Users { get; set; }
            public DbSet<Models.Role> Roles { get; set; }
            public DbSet<Models.Skill> Skills { get; set; }
            public DbSet<Models.UserSkill> UserSkills { get; set; }
            public DbSet<Models.RoleSkill> RoleSkills { get; set; }
    }
    
   
}
