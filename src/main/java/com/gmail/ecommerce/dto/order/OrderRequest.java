package com.gmail.ecommerce.dto.order;

import lombok.Data;

import javax.validation.constraints.*;
import java.util.Map;

import static com.gmail.ecommerce.constants.ErrorMessage.*;

@Data
public class OrderRequest {

    private Double totalPrice;
    private Map<Long, Long> perfumesId;

    @NotBlank(message = FILL_IN_THE_INPUT_FIELD)
    private String firstName;

    @NotBlank(message = FILL_IN_THE_INPUT_FIELD)
    private String lastName;

    @NotBlank(message = FILL_IN_THE_INPUT_FIELD)
    private String city;

    @NotBlank(message = FILL_IN_THE_INPUT_FIELD)
    private String address;

    @Email(message = INCORRECT_EMAIL)
    @NotBlank(message = EMAIL_CANNOT_BE_EMPTY)
    private String email;

    @NotBlank(message = EMPTY_PHONE_NUMBER)
    private String phoneNumber;

    @NotNull(message = EMPTY_POST_INDEX)
    @Min(value = 5, message = "Post index must contain 5 digits")
//    @Pattern(regexp = "\\d{6}", message = "Pincode must be 6 digits")
    private Integer postIndex;
}
