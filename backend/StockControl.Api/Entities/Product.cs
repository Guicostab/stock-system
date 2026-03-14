namespace StockControl.Api.Entities;

public class Product
{
    public Guid Id { get; set; }

    public string Name { get; set; }

    public decimal Quantity { get; set; }

    public decimal Price { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public List<StockMovement> Movements { get; set; } = new();
}