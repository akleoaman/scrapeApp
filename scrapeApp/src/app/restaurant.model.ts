
export class Restaurant{
    restaurant: String;
    hash: String;
    url: String;
    info: String;
    updated: String;
    menu: Category[];

}

export class Category{
    category: String;
    products: Product[];
}

export class Product{
    product: String;
    rate: String;
}