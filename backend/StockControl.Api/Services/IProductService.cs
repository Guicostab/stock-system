using StockControl.Api.Entities;

namespace StockControl.Api.Services;

public interface IProductService
{
    Task<List<Product>> GetAll();

    Task<Product?> GetById(Guid id);

    Task<Product> Create(Product product);
    
    Task<List<StockMovement>> GetMovements(Guid productId);

    Task<List<Product>> GetLowStock();

    Task<List<object>> GetReport();
}