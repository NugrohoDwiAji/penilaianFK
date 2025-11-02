import React, { useState, useCallback } from 'react';
import { ChevronDown, ChevronRight, Plus, Edit3, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

// Type definitions
interface DataNode {
  id: string;
  nama: string;
  bobot: number;
  parentId: string | null;
  mkId: string;
  created_at: string;
  updated_at: string;
  children: DataNode[];
}

interface EditingNode {
  id: string;
  nama: string;
  bobot: number;
}

const WeightHierarchyInterface = () => {
  const initialData: DataNode[] = [
    {
      "id": "cd76c49b-c7f3-4fff-a918-be0c720d6e27",
      "nama": "test1",
      "bobot": 20,
      "parentId": null,
      "mkId": "e1b653cb-e4f1-4121-a68c-1988ada343e0",
      "created_at": "2025-09-24T02:53:34.324Z",
      "updated_at": "2025-09-24T02:53:34.324Z",
      "children": [
        {
          "id": "a2752db6-3eb1-45ea-be7b-f1d54a783f74",
          "nama": "test2",
          "bobot": 10,
          "parentId": "cd76c49b-c7f3-4fff-a918-be0c720d6e27",
          "mkId": "e1b653cb-e4f1-4121-a68c-1988ada343e0",
          "created_at": "2025-09-24T02:53:34.324Z",
          "updated_at": "2025-09-24T02:53:34.324Z",
          "children": [
            {
              "id": "81b4037e-bf2d-4324-83c6-7d62a78f458c",
              "nama": "test2sub",
              "bobot": 5,
              "parentId": "a2752db6-3eb1-45ea-be7b-f1d54a783f74",
              "mkId": "e1b653cb-e4f1-4121-a68c-1988ada343e0",
              "created_at": "2025-09-24T02:53:34.324Z",
              "updated_at": "2025-09-24T02:53:34.324Z",
              "children": []
            },
            {
              "id": "fea3adff-234f-46e7-b0cd-19eeb240b0d3",
              "nama": "test2sub",
              "bobot": 5,
              "parentId": "a2752db6-3eb1-45ea-be7b-f1d54a783f74",
              "mkId": "e1b653cb-e4f1-4121-a68c-1988ada343e0",
              "created_at": "2025-09-24T02:53:34.324Z",
              "updated_at": "2025-09-24T02:53:34.324Z",
              "children": []
            }
          ]
        },
        {
          "id": "ba83a184-5ec8-4bff-ba12-f545416e870b",
          "nama": "test3",
          "bobot": 10,
          "parentId": "cd76c49b-c7f3-4fff-a918-be0c720d6e27",
          "mkId": "e1b653cb-e4f1-4121-a68c-1988ada343e0",
          "created_at": "2025-09-24T02:53:34.324Z",
          "updated_at": "2025-09-24T02:53:34.324Z",
          "children": []
        }
      ]
    }
  ];

  const [data, setData] = useState<DataNode[]>(initialData);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [editingNode, setEditingNode] = useState<EditingNode | null>(null);

  // Calculate total weight of children
  const calculateChildrenWeight = useCallback((node: DataNode): number => {
    return node.children.reduce((sum, child) => sum + child.bobot, 0);
  }, []);

  // Check if node weight is valid (children sum <= parent weight)
  const isWeightValid = useCallback((node: DataNode): boolean => {
    const childrenSum = calculateChildrenWeight(node);
    return childrenSum <= node.bobot;
  }, [calculateChildrenWeight]);

  // Calculate remaining weight available for new children
  const getRemainingWeight = useCallback((node: DataNode): number => {
    return node.bobot - calculateChildrenWeight(node);
  }, [calculateChildrenWeight]);

  // Toggle node expansion
  const toggleExpand = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  // Find and update node recursively
  const updateNodeById = useCallback((nodes: DataNode[], id: string, updatedNode: Partial<DataNode>): DataNode[] => {
    return nodes.map(node => {
      if (node.id === id) {
        return { ...node, ...updatedNode };
      }
      if (node.children.length > 0) {
        return {
          ...node,
          children: updateNodeById(node.children, id, updatedNode)
        };
      }
      return node;
    });
  }, []);

  // Save editing changes
  const saveEdit = () => {
    if (editingNode) {
      const updatedData = updateNodeById(data, editingNode.id, {
        nama: editingNode.nama,
        bobot: editingNode.bobot
      });
      setData(updatedData);
      setEditingNode(null);
    }
  };

  // Add new child node
  const addChild = (parentId: string) => {
    const newChild: DataNode = {
      id: `new-${Date.now()}`,
      nama: 'New Item',
      bobot: 1,
      parentId: parentId,
      mkId: 'e1b653cb-e4f1-4121-a68c-1988ada343e0',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      children: []
    };

    const addChildToNode = (nodes: DataNode[]): DataNode[] => {
      return nodes.map(node => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [...node.children, newChild]
          };
        }
        if (node.children.length > 0) {
          return {
            ...node,
            children: addChildToNode(node.children)
          };
        }
        return node;
      });
    };

    setData(addChildToNode(data));
    setExpandedNodes(new Set([...expandedNodes, parentId]));
  };

  // Render node recursively
  const renderNode = (node: DataNode, level: number = 0) => {
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isValid = isWeightValid(node);
    const childrenWeight = calculateChildrenWeight(node);
    const remainingWeight = getRemainingWeight(node);
    const isEditing = editingNode?.id === node.id;

    return (
      <div key={node.id} className="mb-2">
        <div
          className={`flex items-center gap-2 p-3 rounded-lg border transition-all duration-200 ${
            isValid 
              ? 'bg-white border-gray-200 hover:border-blue-300' 
              : 'bg-red-50 border-red-200 hover:border-red-300'
          }`}
          style={{ marginLeft: `${level * 24}px` }}
        >
          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button
              onClick={() => toggleExpand(node.id)}
              className="p-1 rounded hover:bg-gray-100"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-6" />}

          {/* Status Icon */}
          {isValid ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}

          {/* Node Content */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={editingNode.nama}
                  onChange={(e) => setEditingNode({ ...editingNode, nama: e.target.value })}
                  className="px-2 py-1 border rounded text-sm flex-1"
                />
                <input
                  type="number"
                  value={editingNode.bobot}
                  onChange={(e) => setEditingNode({ ...editingNode, bobot: parseInt(e.target.value) || 0 })}
                  className="px-2 py-1 border rounded text-sm w-16"
                />
                <button
                  onClick={saveEdit}
                  className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingNode(null)}
                  className="px-2 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900">{node.nama}</span>
                  <div className="text-sm text-gray-500">
                    Bobot: {node.bobot}
                    {hasChildren && (
                      <>
                        {' | '}Children: {childrenWeight}
                        {' | '}Sisa: {remainingWeight}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingNode({ id: node.id, nama: node.nama, bobot: node.bobot })}
                    className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => addChild(node.id)}
                    className="p-1 text-gray-500 hover:text-green-500 hover:bg-green-50 rounded"
                    title="Add Child"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Weight Validation Message */}
        {!isValid && (
          <div className="text-red-600 text-sm mt-1 ml-8">
            ⚠️ Total bobot children ({childrenWeight}) melebihi bobot parent ({node.bobot})
          </div>
        )}

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="mt-2">
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Weight Hierarchy Management
        </h1>
        <p className="text-gray-600">
          Kelola struktur hierarkis dengan validasi bobot. Total bobot children tidak boleh melebihi bobot parent.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Structure Tree</h2>
        <div className="space-y-2">
          {data.map(node => renderNode(node))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {data.reduce((sum, node) => sum + node.bobot, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Root Weight</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {(() => {
                let validCount = 0;
                const checkValid = (nodes: DataNode[]) => {
                  nodes.forEach(node => {
                    if (isWeightValid(node)) validCount++;
                    checkValid(node.children);
                  });
                };
                checkValid(data);
                return validCount;
              })()}
            </div>
            <div className="text-sm text-gray-600">Valid Nodes</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {(() => {
                let invalidCount = 0;
                const checkInvalid = (nodes: DataNode[]) => {
                  nodes.forEach(node => {
                    if (!isWeightValid(node)) invalidCount++;
                    checkInvalid(node.children);
                  });
                };
                checkInvalid(data);
                return invalidCount;
              })()}
            </div>
            <div className="text-sm text-gray-600">Invalid Nodes</div>
          </div>
        </div>
      </div>

      {/* Formula Explanation */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Weight Formula</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Validasi Bobot:</strong> Σ(children.bobot) ≤ parent.bobot</p>
          <p><strong>Sisa Bobot:</strong> parent.bobot - Σ(children.bobot)</p>
          <p><strong>Status Valid:</strong> Hijau ✅ = Valid, Merah ❌ = Invalid</p>
        </div>
      </div>
    </div>
  );
};

export default WeightHierarchyInterface;