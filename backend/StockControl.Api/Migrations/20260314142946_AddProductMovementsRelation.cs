using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockControl.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddProductMovementsRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "Quantity",
                table: "Products",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Quantity",
                table: "Products",
                type: "integer",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");
        }
    }
}
