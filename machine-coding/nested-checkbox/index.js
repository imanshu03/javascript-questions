const data = [
  {
    name: "India",
    id: 1,
    children: [
      {
        name: "Bengaluru",
        id: 2,
        children: [
          {
            name: "Indiranagar",
            id: 8,
            children: [],
          },
          {
            name: "Whitefield",
            id: 9,
            children: [],
          },
        ],
      },
      {
        name: "Hyderabad",
        id: 3,
      },
      {
        name: "Gurgaon",
        id: 4,
      },
    ],
  },
  {
    name: "Australia",
    id: 5,
    children: [
      {
        name: "Sydeny",
        id: 6,
        children: [],
      },
      {
        name: "Melbourne",
        id: 7,
        children: [],
      },
    ],
  },
];

function generateCheckboxID(id) {
  return `checkbox-${id}`;
}

function generateNestedCheckboxListID(id) {
  return `checkbox-${id}-nested-list`;
}

function updateParentState(id) {
  const checkbox = document.getElementById(generateCheckboxID(id));
  if (!checkbox) return;
  const nestedCheckboxes = Array.from(
    document
      .getElementById(generateNestedCheckboxListID(id))
      ?.querySelectorAll('input[type="checkbox"]') || []
  );

  if (nestedCheckboxes.length === 0) return;

  const allChecked = nestedCheckboxes.every((node) => node.checked);
  const someChecked = nestedCheckboxes.some((node) => node.checked);

  checkbox.checked = allChecked;
  checkbox.indeterminate = someChecked && !allChecked;
  if (checkbox.dataset.parentId) {
    updateParentState(checkbox.dataset.parentId);
  }
}

function createNestedCheckboxes(nodes, parentId = null) {
  const container = document.createElement("div");
  container.classList.add("nested-container");

  if (parentId !== null) container.classList.add("margin-l");

  nodes.forEach((node) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("checkbox-wrapper");

    const checkbox = document.createElement("input");
    if (parentId) checkbox.dataset.parentId = parentId;
    checkbox.id = generateCheckboxID(node.id);
    checkbox.type = "checkbox";
    checkbox.checked = false;

    const label = document.createElement("label");
    label.textContent = node.name;
    label.htmlFor = checkbox.id;

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    container.appendChild(wrapper);

    if (node.children?.length) {
      const nestedContainer = createNestedCheckboxes(node.children, node.id);
      nestedContainer.id = generateNestedCheckboxListID(node.id);
      container.appendChild(nestedContainer);
    }

    checkbox.addEventListener("change", function (e) {
      const { checked } = e.target;

      const nestedContainer = document.getElementById(
        generateNestedCheckboxListID(node.id)
      );
      if (nestedContainer) {
        Array.from(
          nestedContainer.querySelectorAll('input[type="checkbox"]')
        ).forEach((child) => {
          child.checked = checked;
          child.indeterminate = false;
        });
      }

      if (parentId) updateParentState(parentId);
    });
  });

  return container;
}

function initialize(nodes) {
  const stylesheet = document.createElement("style");
  stylesheet.textContent = `
        .container {
            padding: 12px
        }
        label {
            margin-left: 5px
        }
        .nested-container {
            margin: 5px 0px;
        }
        .margin-l {
            margin-left: 20px;
        }
        .checkbox-wrapper {
            margin-top: 5px;
        }
    `;
  document.head.appendChild(stylesheet);

  const parentWrapper = document.createElement("div");
  parentWrapper.id = "checkbox-container";
  parentWrapper.classList.add("container");
  document.body.appendChild(parentWrapper);

  const nestedNodes = createNestedCheckboxes(nodes);
  parentWrapper.appendChild(nestedNodes);
}

document.addEventListener("DOMContentLoaded", function () {
  initialize(data);
});
