using AI_Course_Recommendation_System.Models;
using Microsoft.EntityFrameworkCore;

namespace AI_Course_Recommendation_System.Data
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
    {
            public DbSet<User> Users { get; set; }
            public DbSet<Role> Roles { get; set; }
            public DbSet<Skill> Skills { get; set; }
            public DbSet<UserSkill> UserSkills { get; set; }
            public DbSet<RoleSkill> RoleSkills { get; set; }
            public DbSet<UserRole> UserRoles { get; set; }

            protected override void OnModelCreating(ModelBuilder modelBuilder)
            {
                base.OnModelCreating(modelBuilder);
                modelBuilder.Entity<UserSkill>()
                     .HasOne(us => us.User)
                     .WithMany(u => u.UserSkills)
                     .HasForeignKey(us => us.UserId);
                modelBuilder.Entity<UserSkill>()
                   .HasOne(us => us.Skill)
                   .WithMany(s => s.UserSkills)
                   .HasForeignKey(us => us.SkillId);
                modelBuilder.Entity<RoleSkill>()
                   .HasOne(rs => rs.Skill)
                   .WithMany(s => s.RoleSkills)
                   .HasForeignKey(rs => rs.SkillId);
                modelBuilder.Entity<RoleSkill>()
                .HasOne(rs => rs.Role)
                .WithMany(r => r.RoleSkills)
                .HasForeignKey(rs => rs.RoleId);
                modelBuilder.Entity<UserSkill>()
                   .HasIndex(us => new { us.UserId, us.SkillId })
                   .IsUnique();

                modelBuilder.Entity<RoleSkill>()
                    .HasIndex(rs => new { rs.RoleId, rs.SkillId })
                    .IsUnique();
                modelBuilder.Entity<User>()
                   .HasIndex(u => u.Email)
                   .IsUnique();
            // Roles
            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "Frontend Developer" },
                new Role { Id = 2, Name = "Backend Developer" }
            );

            // Skills
            modelBuilder.Entity<Skill>().HasData(
                new Skill { Id = 1, Name = "HTML" },
                new Skill { Id = 2, Name = "CSS" },
                new Skill { Id = 3, Name = "JavaScript" },
                new Skill { Id = 4, Name = "React" },
                new Skill { Id = 5, Name = "SQL" }
            );

            // RoleSkills
            modelBuilder.Entity<RoleSkill>().HasData(
                new RoleSkill { Id = 1, RoleId = 1, SkillId = 4, RequiredLevel = 4 },
                new RoleSkill { Id = 2, RoleId = 1, SkillId = 3, RequiredLevel = 3 },
                new RoleSkill { Id = 3, RoleId = 2, SkillId = 5, RequiredLevel = 4 }
            );

            //// Users
            //modelBuilder.Entity<User>().HasData(
            //    new User { Id = 1, Name = "Arzoo", Email = "arzoo@test.com", RoleId = 1 }
            //);

            //// UserSkills
            //modelBuilder.Entity<UserSkill>().HasData(
            //    new UserSkill { Id = 1, UserId = 1, SkillId = 3, CurrentLevel = 2 },
            //    new UserSkill { Id = 2, UserId = 1, SkillId = 4, CurrentLevel = 1 }
            //);
            // UserRoles
            modelBuilder.Entity<UserRole>().HasData(
                new UserRole { Id = 1, Name = "Admin" },
                new UserRole { Id = 2, Name = "User" }
            );

        }
    }
    
   
}
