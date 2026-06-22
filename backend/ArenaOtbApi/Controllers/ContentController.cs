using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ContentController : ControllerBase
{
    // Accessible by Guests and Registered Users
    [HttpGet("public-feed")]
    [Authorize] 
    public IActionResult GetFeed() => Ok("Everyone logged in can see this.");

    // Accessible ONLY by Registered Users (Not Guests)
    [HttpGet("premium-content")]
    [Authorize(Roles = "user,admin")] 
    public IActionResult GetPremium() => Ok("Only verified users can see this.");
}