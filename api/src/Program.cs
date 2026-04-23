using AI_Course_Recommendation_System.Data;
using AI_Course_Recommendation_System.Models;
using DTO;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ApplicationDbContext>(option =>
{
    option.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddAutoMapper(o =>
   { o.CreateMap<User, CreateUserDTO>().ReverseMap();
       o.CreateMap<User, UpdateUserDTO>().ReverseMap();
       o.CreateMap<User, UserDTO>().ReverseMap();
       o.CreateMap<Role, RoleDTO>().ReverseMap();
     o.CreateMap<Skill, SkillDTO>().ReverseMap();
       o.CreateMap<UserSkill, SkillLevelResponseDTO>()
        .ForMember(dest => dest.SkillName,
            opt => opt.MapFrom(src => src.Skill.Name));
       o.CreateMap<RoleSkill, RoleSkillLevelResponseDTO>()
      .ForMember(dest => dest.SkillName,
          opt => opt.MapFrom(src => src.Skill.Name));

   });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "AI Course Recommendation System API V1");
        //options.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
    });
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
