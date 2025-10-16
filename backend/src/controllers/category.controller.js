import { Category } from '../models/Category.js';
import { Post } from '../models/Post.js';

export async function listCategories(_req, res) {
  const categories = await Category.findAll();
  res.json(categories);
}

export async function getPostsByCategory(req, res) {
  const { slug } = req.params;
  const category = await Category.findBySlug(slug);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  const posts = await Post.findByCategory(category.id);
  const normalized = posts.map((p) => ({
    ...p,
    categoryId: { name: category.name, slug: category.slug }
  }));
  res.json({ category: { name: category.name, slug: category.slug }, posts: normalized });
}

export async function createCategory(req, res) {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create category' });
  }
}

export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.update(id, { name });
    res.json(category);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update category' });
  }
}

export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    await Category.delete(id);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
}
