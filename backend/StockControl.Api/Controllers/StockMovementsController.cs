using Microsoft.AspNetCore.Mvc;
using StockControl.Api.DTOs;
using StockControl.Api.Services;

namespace StockControl.Api.Controllers;

[ApiController]
[Route("api/stock-movements")]
public class StockMovementsController : ControllerBase
{
    private readonly IStockMovementService _service;

    public StockMovementsController(IStockMovementService service)
    {
        _service = service;
    }

    // GET all movements
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var movements = await _service.GetAll();
        return Ok(movements);
    }

    // GET movements by product
    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetByProduct(Guid productId)
    {
        var movements = await _service.GetByProduct(productId);
        return Ok(movements);
    }

    // CREATE movement
    [HttpPost]
    public async Task<IActionResult> Create(CreateStockMovementDto dto)
    {
        var result = await _service.Create(dto);

        if (!result.Success)
            return BadRequest(result.Message);

        return Ok(result.Data);
    }
}