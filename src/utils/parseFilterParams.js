const parseType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;
  const isGender = (type) => ['work', 'home', 'personal'].includes(type);

  if (isGender(type)) return type;
};

const parseBoolean = (value) => {
  const isString = typeof value === 'string';
    if (!isString) return;
    if (!['true', 'false'].includes(value)) return;

  const parsedBool = Boolean(value);

  return parsedBool;
};

export const parseFilterParams = (query) => {
  const { type, favorite } = query;

    const parsedType = parseType(type);
    const parsedFavorite = parseBoolean(favorite);

  return {
      type: parsedType,
      favorite: parsedFavorite,
  };
};
