using Microsoft.EntityFrameworkCore;
using StockControl.Api.Data;
using StockControl.Api.DTOs;
using StockControl.Api.Entities;

namespace StockControl.Api.Services;

public class StockMovementService : IStockMovementService
{
    private readonly AppDbContext _context;

    public StockMovementService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<StockMovement>> GetAll()
    {
        return await _context.StockMovements
            .Include(x => x.Product)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<StockMovement>> GetByProduct(Guid productId)
    {
        return await _context.StockMovements
            .Where(x => x.ProductId == productId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<(bool Success, string Message, StockMovement? Data)> Create(CreateStockMovementDto dto)
    {
        var product = await _context.Products.FindAsync(dto.ProductId);

        if (product == null)
            return (false, "Produto não encontrado", null);

        switch (dto.MovementType)
        {
            case MovementType.In:
                product.Quantity += dto.Quantity;
                break;

            case MovementType.Out when product.Quantity < dto.Quantity:
                return (false, "Estoque insuficiente", null);

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

        return (true, "", movement);
    }
}