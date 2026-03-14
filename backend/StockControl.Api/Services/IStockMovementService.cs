using StockControl.Api.DTOs;
using StockControl.Api.Entities;

namespace StockControl.Api.Services;

public interface IStockMovementService
{
    Task<List<StockMovement>> GetAll();

    Task<List<StockMovement>> GetByProduct(Guid productId);

    Task<(bool Success, string Message, StockMovement? Data)> Create(CreateStockMovementDto dto);
}