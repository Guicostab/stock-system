using Microsoft.EntityFrameworkCore;
using StockControl.Api.Data;
using StockControl.Api.Entities;

namespace StockControl.Api.Services;

public class ProductService : IProductService
{
    private readonly AppDbContext _context;

    public ProductService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Product>> GetAll()
    {
        return await _context.Products.ToListAsync();
    }

    public async Task<Product?> GetById(Guid id)
    {
        return await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Product> Create(Product product)
    {
        _context.Products.Add(product);

        await _context.SaveChangesAsync();

        return product;
    }
    
    public async Task<List<StockMovement>> GetMovements(Guid productId)
    {
        return await _context.StockMovements
            .Where(m => m.ProductId == productId)
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Product>> GetLowStock()
    {
        return await _context.Products
            .Where(p => p.Quantity <= 5)
            .ToListAsync();
    }

    public async Task<List<object>> GetReport()
    {
        return await _context.Products
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Quantity,
                TotalMovements = p.Movements.Count
            })
            .Cast<object>()
            .ToListAsync();
    }
}