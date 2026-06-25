using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using ArenaOtbApi.Data;
using ArenaOtbApi.Models;
using ArenaOtbApi.Services;

[ApiController]
[Route("api/[controller]")]

public class ArenaController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ArenaController(ApplicationDbContext context)
    {
        _context = context;
    }

    
}