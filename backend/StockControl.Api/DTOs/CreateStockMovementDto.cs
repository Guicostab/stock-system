using StockControl.Api.Entities;

namespace StockControl.Api.DTOs;

public class CreateStockMovementDto
{
    public Guid ProductId { get; set; }

    public decimal Quantity { get; set; }

    public MovementType MovementType { get; set; }
}