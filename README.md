# morph-swipeout
Component to allow swipeout of content by use that will reveal additional actions that don't take screen space normally

## Getting Started

For the information about how to clone the desired repository, running the local server and testing, please refer to this [link](https://github.com/moduware/polymorph-components/blob/master/INFO.md).

## Demo

- Here is a quick demo of the `morph-swipeout` element swiping open delete button and clicking on the button to delete item.

  <p align="center">
    <img src="demo-images/morph-swipeout-demo.gif" alt="morph-swipeout demo"/>
  </p>

- This is a sample HTML markup for `morph-swipeout` with left and right buttons

  ```html

  <morph-swipeout>

    Swipeout content 

    <span slot="right-buttons">
      <morph-button class="swiper-integration-class" color="red" filled flat>Delete</morph-button>
    </span>

  </morph-swipeout>

  ```

- IMPORTANT: `class="swiper-integration-class"` required to be added on the `morph-button` class for the button to render properly  

- The `<span slot="left-buttons">` for the left action button is optional. The `<span slot="right-buttons">` for the right action button is required for there is no point in having overswipe when there is no action button to show

- The `morph-button` polymer element is required for the action buttons

## Basic `morph-swipeout` Markup

- Example Minimum Basic Markup

```html

  <morph-swipeout>

    <div>
      <p>Swipeout content</p>
    </div>

    <span slot="right-buttons">
      <morph-button class="swiper-integration-class" color="red" filled flat item-delete>Delete</morph-button>
    </span>

  </morph-swipeout>

  ```

### Attributes for `morph-swipeout` Element

|     Custom Attribute              |   Type  | Description                                                                                   | Default          |
|:---------------------------------:|:-------:|-----------------------------------------------------------------------------------------------|------------------|
|          **`overswiper`**         | Boolean | Property used to decide if action on the left or right is executed when swipe far enough      | **`false`**      |
|      **`overswipeTreshold`**      | Number  | The amount of pixel swipe to trigger overswipe. (Default to offsetWidth / 2)                  | **`See Notes`**  |
|   **`_trackInitialTransform`**    | Number  | Initial value of transform during event.detail.state == 'start'                               | **`No default`** |

### Required Attributes for `morph-button` Action Button to Work Properly

|     Custom Attribute |   Type  | Description                                                                     |
|:--------------------:|:-------:|---------------------------------------------------------------------------------|
|   **`color`**        | Boolean | `morph-button` property used to set button color - REQUIRED                     |
|   **`flat`**         | Boolean | `morph-button` property used to get flat corners - REQUIRED                     |
|   **`filled`**       | Boolean | `morph-button` property used to get white text on colored background - REQUIRED |
|   **`item-delete`**  | Boolean | `morph-button` property used to delete item when button is clicked              |


## Overswiper `morph-swipeout` markup with swipeout-delete

- Example Overswiper with swipeout-delete markup

```html

  <morph-swipeout overswiper>

    <div>
      <p>Swipeout content</p>
    </div>

    <span slot="right-buttons">
      <morph-button class="swiper-integration-class" color="red" filled flat swipeout-delete>Delete</morph-button>
    </span>

  </morph-swipeout>

  ```
### Attributes for `morph-swipeout` Overswiper

|  `morph-swipeout` Attribute  |   Type  | Description                                              |
|:----------------------------:|:-------:|----------------------------------------------------------|
|    **`overswiper`**          | Boolean | `morph-swipeout` property used to activate overswiping   |

### Attributes for `morph-button` Overswiper

|  `morph-swipeout` Attribute  |   Type  | Description                                                               |
|:----------------------------:|:-------:|---------------------------------------------------------------------------|
|    **`swipeout-delete`**     | Boolean | `morph-button` property used to activate deleting item when overswiping   |

## Overswiper `morph-swipeout` markup with swipeout-delete and swipeout-prompt-text

- Example Overswiper with swipeout-delete and swipeout-prompt-text markup

```html

  <morph-swipeout overswiper>

    <div>
      <p>Swipeout content</p>
    </div>

    <span slot="right-buttons">
      <morph-button class="swiper-integration-class" color="red" filled flat swipeout-delete swipeout-prompt-text="Do you to delete item?">Delete</morph-button>
    </span>

  </morph-swipeout>

  ```
### Attributes for `morph-swipeout` Overswiper

|  `morph-swipeout` Attribute  |   Type  | Description                                              |
|:----------------------------:|:-------:|----------------------------------------------------------|
|    **`overswiper`**          | Boolean | `morph-swipeout` property used to activate overswiping   |

### Attributes for `morph-button` Overswiper

|  `morph-swipeout` Attribute  |   Type  | Description                                                                           |
|:----------------------------:|:-------:|---------------------------------------------------------------------------------------|
|    **`swipeout-delete`**     | Boolean | `morph-button` property used to activate deleting item when overswiping               |
| **`swipeout-prompt-text`**   | Boolean | `morph-button` property used to add prompt text before deleting item when overswiping |

## Styling

- The following custom CSS properties are available for styling `morph-swipeout` component


Custom property                               | Description                                                                      | Default    |
----------------------------------------------|----------------------------------------------------------------------------------|------------|
`--back-container-background-color`           | Background color for back container property                                     | #fff       |
`--swipe-action-after-background-color-left`  | To help get the left morph-button background-color swipe action psuedo element   | yellow     |
`--swipe-action-after-background-color-right` | To help get the right morph-button background-color swipe action psuedo element  | yellow     |
