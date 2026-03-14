using Microsoft.AspNetCore.Mvc;
using StockControl.Api.Entities;
using StockControl.Api.Services;

namespace StockControl.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _service;

    public ProductsController(IProductService service)
    {
        _service = service;
    }

    // GET all products
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var products = await _service.GetAll();
        return Ok(products);
    }

    // GET product by id
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var product = await _service.GetById(id);

        if (product == null)
            return NotFound();

        return Ok(product);
    }

    // CREATE product
    [HttpPost]
    public async Task<IActionResult> Create(Product product)
    {
        var created = await _service.Create(product);

        return CreatedAtAction(nameof(GetById), new { id = product.Id }, created);
    }
    
    [HttpGet("{id}/movements")]
    public async Task<IActionResult> GetMovements(Guid id)
    {
        var movements = await _service.GetMovements(id);

        return Ok(movements);
    }
    
    [HttpGet("low-stock")]
    public async Task<IActionResult> GetLowStock()
    {
        var products = await _service.GetLowStock();

        return Ok(products);
    }
    
    [HttpGet("report")]
    public async Task<IActionResult> GetReport()
    {
        var report = await _service.GetReport();

        return Ok(report);
    }
}