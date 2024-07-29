import json

def generate_flattened_categories(file_path, max_depth=4, children_per_category=10):
    categories = []
    category_id = 1

    def create_category(parent_id, current_depth=0):
        nonlocal category_id
        category = {
            "id": category_id,
            "name": f"Category {category_id}",
            "parentId": parent_id
        }
        categories.append(category)
        current_id = category_id
        category_id += 1

        if current_depth < max_depth - 1:
            for _ in range(children_per_category):
                create_category(current_id, current_depth + 1)

    # Create root categories
    for _ in range(children_per_category):
        create_category(None)

    with open(file_path, 'w') as f:
        json.dump(categories, f, indent=2)

    print(f"Generated {len(categories)} flattened categories in {file_path}")

if __name__ == "__main__":
    generate_flattened_categories("flattened_categories.json")