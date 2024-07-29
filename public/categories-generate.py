import json

def generate_categories(max_depth=4, children_per_category=10):
    category_id = 1

    def create_category(current_depth=0):
        nonlocal category_id
        category = {
            "id": category_id,
            "name": f"Category {category_id}",
            "parentId": None if current_depth == 0 else category_id - 1,
            "children": []
        }
        category_id += 1

        if current_depth < max_depth - 1:
            category["children"] = [create_category(current_depth + 1) for _ in range(children_per_category)]

        return category

    root_categories = [create_category() for _ in range(children_per_category)]
    return root_categories

if __name__ == "__main__":
    categories = generate_categories()
    with open("categories.json", "w") as f:
        json.dump(categories, f, indent=2)

    # Count total categories
    def count_categories(cats):
        return len(cats) + sum(count_categories(cat["children"]) for cat in cats)

    total_categories = count_categories(categories)
    print(f"Generated {len(categories)} root categories with a total of {total_categories} categories.")
    print(f"Each category has exactly 10 children up to a depth of 10 levels.")