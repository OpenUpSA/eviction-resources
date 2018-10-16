function calcIfLoadingOverride(loading, forceLoading) {
  if (forceLoading === true) {
    return true;
  }

  if (forceLoading === false) {
    return false;
  }

  return loading;
}


export { calcIfLoadingOverride };
