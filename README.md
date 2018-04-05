# morph-swipeout
Component to allow swipeout of content by use that will reveal additional actions that don't take screen space normally

## Getting Started

For the information about how to clone the desired repository, running the local server and testing, please refer to this [link](https://github.com/moduware/polymorph-components/blob/master/INFO.md).

## Demo

- Here is a quick demo of the morph-list-view element for IOS.

  <p align="center">
    <img src="demo-images/THIS-WILL-BE-CHANGE-WHEN-COMPONENT-IS-READY" alt="IOS morph-swipeout demo"/>
  </p>

  - Here is a quick demo of the morph-list-view element for Android.

  <p align="center">
    <img src="demo-images/THIS-WILL-BE-CHANGE-WHEN-COMPONENT-IS-READY" alt="Android morph-swipeout demo"/>
  </p>

  - This is a sample HTML markup for `morph-swipeout`

  ```html

  <morph-swipeout>
    <span slot="left-buttons">
      <morph-button color="green" filled big flat>Action</morph-button>
    </span>
    Swipeout content 
    <span slot="right-buttons">
      <morph-button color="red" filled big flat>Delete</morph-button>
    </span>
  </morph-swipeout>

  ```
### Attributes

|     Custom Attribute    |   Type  | Description                                                                                   | Default        |
|:-----------------------:|:-------:|-----------------------------------------------------------------------------------------------|----------------|
|      **`property`**     | Boolean | THIS WILL BE UPDATE WHEN NEW PROPERTY IS ADDED FOR `morph-swipeout` component                 | **`false`**    |

## Styling

- The following custom CSS properties are available for styling `morph-swipeout` component


Custom property                     | Description                                                                      | Default    |
------------------------------------|----------------------------------------------------------------------------------|------------|
`--back-container-background-color` | Background color for back container property                                     | #fff       |
