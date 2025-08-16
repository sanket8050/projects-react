"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import Button from "./common/Button"
import Modal from "./common/Modal"
import { generateId, formatPrice } from "../utils/helpers"

const MenuManager = ({ menu, onUpdate, disabled }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editingMenu, setEditingMenu] = useState([...menu])
  const [showAddModal, setShowAddModal] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const handleSave = () => {
    onUpdate(editingMenu)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditingMenu([...menu])
    setIsEditing(false)
  }

  const handleAddItem = (data) => {
    const newItem = {
      id: generateId(),
      name: data.name,
      price: data.price ? Number.parseFloat(data.price) : null,
      available: true,
      notes: data.notes || "",
    }
    setEditingMenu([...editingMenu, newItem])
    setShowAddModal(false)
    reset()
  }

  const handleRemoveItem = (index) => {
    const newMenu = editingMenu.filter((_, i) => i !== index)
    setEditingMenu(newMenu)
  }

  const handleToggleAvailability = (index) => {
    const newMenu = [...editingMenu]
    newMenu[index].available = !newMenu[index].available
    setEditingMenu(newMenu)
  }

  const handleUpdateItem = (index, field, value) => {
    const newMenu = [...editingMenu]
    if (field === "price") {
      newMenu[index][field] = value ? Number.parseFloat(value) : null
    } else {
      newMenu[index][field] = value
    }
    setEditingMenu(newMenu)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Today's Menu</h3>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <Button variant="secondary" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave} disabled={disabled}>
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)} disabled={disabled}>
                Edit Menu
              </Button>
              <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)} disabled={disabled}>
                Add Item
              </Button>
            </>
          )}
        </div>
      </div>

      {editingMenu.length === 0 ? (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No menu items</h4>
          <p className="text-gray-600 mb-4">Add your first menu item to get started</p>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            Add Menu Item
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {editingMenu.map((item, index) => (
            <div
              key={item.id || index}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                item.available ? "bg-white border-gray-200" : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdateItem(index, "name", e.target.value)}
                      className="input text-sm"
                      placeholder="Item name"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        step="0.01"
                        value={item.price || ""}
                        onChange={(e) => handleUpdateItem(index, "price", e.target.value)}
                        className="input text-sm"
                        placeholder="Price"
                      />
                      <input
                        type="text"
                        value={item.notes || ""}
                        onChange={(e) => handleUpdateItem(index, "notes", e.target.value)}
                        className="input text-sm"
                        placeholder="Notes (optional)"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h4 className={`font-medium ${item.available ? "text-gray-900" : "text-gray-400 line-through"}`}>
                      {item.name}
                    </h4>
                    {item.notes && <p className="text-sm text-gray-600 mt-1">{item.notes}</p>}
                    {item.price && (
                      <p className={`text-sm font-semibold mt-1 ${item.available ? "text-gray-900" : "text-gray-400"}`}>
                        {formatPrice(item.price)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3 ml-4">
                {isEditing && (
                  <>
                    <button
                      onClick={() => handleToggleAvailability(index)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.available
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      {item.available ? "Available" : "Unavailable"}
                    </button>
                    <button onClick={() => handleRemoveItem(index)} className="text-red-600 hover:text-red-800 p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </>
                )}
                {!isEditing && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.available ? "Available" : "Not Available"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Item Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Menu Item">
        <form onSubmit={handleSubmit(handleAddItem)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <input
              {...register("name", { required: "Item name is required" })}
              type="text"
              className="input"
              placeholder="Enter item name"
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (Optional)</label>
            <input
              {...register("price", {
                min: { value: 0, message: "Price must be positive" },
              })}
              type="number"
              step="0.01"
              className="input"
              placeholder="Enter price"
            />
            {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <input {...register("notes")} type="text" className="input" placeholder="Any special notes" />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Item
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default MenuManager
