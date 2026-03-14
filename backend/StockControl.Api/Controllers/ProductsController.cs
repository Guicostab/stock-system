using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockControl.Api.Data;
using StockControl.Api.Entities;

namespace StockControl.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    // GET all products
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var products = await _context.Products.ToListAsync();
        return Ok(products);
    }

    // GET product by id
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
            return NotFound();

        return Ok(product);
    }

    // CREATE product
    [HttpPost]
    public async Task<IActionResult> Create(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }
    
    [HttpGet("{id}/movements")]
    public async Task<IActionResult> GetMovements(Guid id)
    {
        var movements = await _context.StockMovements
            .Where(m => m.ProductId == id)
            .Include(m => m.Product)
            .ToListAsync();

        return Ok(movements);
    }
    
    [HttpGet("low-stock")]
    public async Task<IActionResult> GetLowStock()
    {
        var products = await _context.Products
            .Where(p => p.Quantity <= 5)
            .ToListAsync();

        return Ok(products);
    }
    
    [HttpGet("report")]
    public async Task<IActionResult> GetReport()
    {
        var report = await _context.Products
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Quantity,
                TotalMovements = p.Movements.Count
            })
            .ToListAsync();

        return Ok(report);
    }
}