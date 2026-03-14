using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockControl.Api.Data;
using StockControl.Api.DTOs;
using StockControl.Api.Entities;

namespace StockControl.Api.Controllers;

[ApiController]
[Route("api/stock-movements")]
public class StockMovementsController : ControllerBase
{
    private readonly AppDbContext _context;

    public StockMovementsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/stock-movements
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var movements = await _context.StockMovements
            .Include(x => x.Product)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return Ok(movements);
    }

    // GET: api/stock-movements/product/{productId}
    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetByProduct(Guid productId)
    {
        var movements = await _context.StockMovements
            .Where(x => x.ProductId == productId)
            .Include(x => x.Product)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return Ok(movements);
    }

    // POST: api/stock-movements
    [HttpPost]
    public async Task<IActionResult> Create(CreateStockMovementDto dto)
    {
        var product = await _context.Products.FindAsync(dto.ProductId);

        if (product == null)
            return NotFound("Produto não encontrado");

        switch (dto.MovementType)
        {
            // Entrada
            case MovementType.In:
                product.Quantity += dto.Quantity;
                break;
            // Saída
            case MovementType.Out when product.Quantity < dto.Quantity:
                return BadRequest("Estoque insuficiente");
            case MovementType.Out:
                product.Quantity -= dto.Quantity;
                break;
        }

        var movement = new StockMovement
        {
            Id = Guid.NewGuid(),
            ProductId = dto.ProductId,
            Quantity = dto.Quantity,
            MovementType = dto.MovementType,
            CreatedAt = DateTime.UtcNow
        };

        _context.StockMovements.Add(movement);

        await _context.SaveChangesAsync();

        return Ok(movement);
    }
}