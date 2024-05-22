// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

// Use JSDoc annotations for type safety
/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").Target} Target
 * @typedef {import("../generated/api").ProductVariant} ProductVariant
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

// The configured entrypoint for the 'purchase.product-discount.run' extension target
/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const discounts = [];

  // Iterate through each cart line
  input.cart.lines.forEach((line) => {
    const quantity = line.quantity;

    // Check if the quantity is greater than or equal to 2
    if (quantity >= 2 && line.merchandise.__typename == "ProductVariant") {
      // Determine discount percentage based on quantity
      let discountPercentage;
      if (quantity === 2) {
        discountPercentage = 10.0;
      } else if (quantity === 3) {
        discountPercentage = 15.0;
      } else {
        discountPercentage = 20.0;
      }

      const variant = /** @type {ProductVariant} */ (line.merchandise);
      const target = /** @type {Target} */ ({
        productVariant: {
          id: variant.id,
        },
      });

      // Add discount to the discounts array
      discounts.push({
        targets: [target],
        value: {
          percentage: {
            value: discountPercentage.toString(), // Convert to string
          },
        },
      });
    }
  });

  if (!discounts.length) {
    // You can use STDERR for debug logs in your function
    console.error("No cart lines qualify for volume discount.");
    return EMPTY_DISCOUNT;
  }

  // The @shopify/shopify_function package applies JSON.stringify() to your function result
  // and writes it to STDOUT
  return {
    discounts,
    discountApplicationStrategy: DiscountApplicationStrategy.First,
  };
}

// // @ts-check
// import { DiscountApplicationStrategy } from "../generated/api";

// // Use JSDoc annotations for type safety
// /**
//  * @typedef {import("../generated/api").RunInput} RunInput
//  * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
//  * @typedef {import("../generated/api").Target} Target
//  * @typedef {import("../generated/api").ProductVariant} ProductVariant
//  */

// /**
//  * @type {FunctionRunResult}
//  */
// const EMPTY_DISCOUNT = {
//   discountApplicationStrategy: DiscountApplicationStrategy.First,
//   discounts: [],
// };

// // The configured entrypoint for the 'purchase.product-discount.run' extension target
// /**
//  * @param {RunInput} input
//  * @returns {FunctionRunResult}
//  */
// export function run(input) {
//   const targets = input.cart.lines
//     // Only include cart lines with a quantity of two or more
//     // and a targetable product variant
//     .filter(
//       (line) =>
//         line.quantity >= 2 && line.merchandise.__typename == "ProductVariant",
//     )
//     .map((line) => {
//       const variant = /** @type {ProductVariant} */ (line.merchandise);
//       return /** @type {Target} */ ({
//         // Use the variant ID to create a discount target
//         productVariant: {
//           id: variant.id,
//         },
//       });
//     });

//   if (!targets.length) {
//     // You can use STDERR for debug logs in your function
//     console.error("No cart lines qualify for volume discount.");
//     return EMPTY_DISCOUNT;
//   }

//   // The @shopify/shopify_function package applies JSON.stringify() to your function result
//   // and writes it to STDOUT
//   return {
//     discounts: [
//       {
//         // Apply the discount to the collected targets
//         targets,
//         // Define a percentage-based discount
//         value: {
//           percentage: {
//             value: "10.0",
//           },
//         },
//       },
//     ],
//     discountApplicationStrategy: DiscountApplicationStrategy.First,
//   };
// }
