using System.Text.Json.Serialization;

namespace StockControl.Api.Entities;

public class StockMovement
{
    public Guid Id { get; set; }

    public Guid ProductId { get; set; }

    public decimal Quantity { get; set; }

    public MovementType MovementType { get; set; }

    public DateTime CreatedAt { get; set; }

    [JsonIgnore]
    public Product Product { get; set; }
}