const items = [
  { id: 6, parentId: 5, name: "Node 2.1" },
  { id: 7, parentId: 3, name: "Node 1.2.1" },
  { id: 8, parentId: 3, name: "Node 1.2.2" },
  { id: 1, parentId: null, name: "Node 1" },
  { id: 2, parentId: 1, name: "Node 1.1" },
  { id: 3, parentId: 1, name: "Node 1.2" },
  { id: 4, parentId: 2, name: "Node 1.1.1" },
  { id: 5, parentId: null, name: "Node 2" },
  { id: 9, parentId: 10, name: "Node 3" },
];

function convertToTreeStructure(nodes) {
  const nodeMap = new Map();

  items.forEach((node) => {
    nodeMap.set(node.id, {
      ...node,
      children: [],
    });
  });

  const roots = [];

  nodes.forEach((node) => {
    const currentNode = nodeMap.get(node.id);

    if (
      currentNode.parentId == null ||
      currentNode.parentId === currentNode.id
    ) {
      roots.push(currentNode);
    } else {
      const parent = nodeMap.get(currentNode.parentId);
      if (parent) {
        parent.children.push(currentNode);
      } else {
        roots.push(currentNode);
      }
    }
  });

  return roots;
}

function createListInDOM(nodes, parent) {
  const ul = document.createElement("ul");

  for (let i = 0; i < nodes.length; i++) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.innerText = nodes[i].name;
    li.appendChild(span);
    if (nodes[i].children.length) {
      const nestedList = createListInDOM(nodes[i].children, li);
      span.classList.add("clickable");
      span.addEventListener("click", function () {
        nestedList.classList.toggle("hide");
      });
    }
    ul.appendChild(li);
  }

  parent.appendChild(ul);
  return ul;
}

createListInDOM(convertToTreeStructure(items), document.getElementById("app"));
