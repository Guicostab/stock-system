namespace StockControl.Api.DTOs;

public class ProductDto
{
    public Guid Id { get; set; }

    public string Name { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; }
}