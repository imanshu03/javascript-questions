const generateID = () => {
  let idx = 0;
  return function () {
    idx += 1;
    return idx;
  };
};

const parentAddBtn = document.getElementById("parent-add-btn");
const parentInputBox = document.getElementById("parent-input-box");

function editComment(p, input, edit) {
  edit.addEventListener("click", function (e) {
    input.style.display = "block";
    const originalValue = p.textContent;
    input.value = originalValue;
    p.style.display = "none";
    edit.innerText = "save";

    addCommentListeners(
      input,
      edit,
      function (value) {
        p.textContent = value;
        input.style.display = "none";
        p.style.display = "block";
        edit.innerText = "edit";
      },
      false
    );
  });
}

function createComment(value, parent) {
  const id = generateID();

  const wrapper = document.createElement("div");
  wrapper.style.marginLeft = "20px";

  const commentTextNode = document.createElement("p");
  const editCommentInput = document.createElement("input");
  const ctaActionsWrapper = document.createElement("div");
  const replyBtn = document.createElement("button");
  const editBtn = document.createElement("button");
  const deleteBtn = document.createElement("button");

  commentTextNode.textContent = value;
  editCommentInput.style.display = "none";
  editBtn.innerText = "edit";

  editComment(commentTextNode, editCommentInput, editBtn);
  wrapper.appendChild(commentTextNode);
  wrapper.appendChild(editCommentInput);
  wrapper.appendChild(editBtn);

  if (parent) {
    parent.appendChild(wrapper);
  } else {
    document.getElementById("comments-wrapper").appendChild(wrapper);
  }
}

function addCommentListeners(input, button, callback, shallDisable = true) {
  input.addEventListener("input", function (e) {
    const { value } = e.target;
    button.disabled = value === "";
  });

  input.addEventListener("keyup", function (e) {
    const { value } = e.target;
    if (e.key === "Enter" && value) {
      callback(value);
    }
  });

  button.addEventListener("click", function () {
    callback(input.value);
  });

  if (shallDisable) button.disabled = true;
}

document.addEventListener("DOMContentLoaded", function () {
  addCommentListeners(parentInputBox, parentAddBtn, createComment);
});
