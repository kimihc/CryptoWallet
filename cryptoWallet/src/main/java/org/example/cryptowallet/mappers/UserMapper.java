package org.example.cryptowallet.mappers;

import org.example.cryptowallet.DTO.UserDTO;
import org.example.cryptowallet.models.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    @Mapping(source = "login", target = "login")
    UserDTO userToUserDTO(User user);

    User userDTOToUser(UserDTO userDTO);
    List<UserDTO> usersToUserDTOs(List<User> users);
}
