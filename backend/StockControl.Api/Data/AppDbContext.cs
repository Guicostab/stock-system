using Microsoft.EntityFrameworkCore;
using StockControl.Api.Entities;

namespace StockControl.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products { get; set; }

    public DbSet<StockMovement> StockMovements { get; set; }

}