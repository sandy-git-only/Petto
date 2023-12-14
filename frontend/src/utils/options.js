  if (newPetType === "dog") {
      setBreedOptions([
        { value: "", label: "不限種類" },
        { value: "混種犬", label: "米克斯 (Mixed)" },
        {
          value: "拉布拉多",
          label: "拉布拉多犬 (Labrador Retriever)",
        },
        { value: "臘腸犬", label: "臘腸犬 (Dachshund)" },
        {
          value: "黃金獵犬",
          label: "黃金獵犬 (Golden Retriever)",
        },
        {
          value: "法國鬥牛",
          label: "法國鬥牛犬 (French Bulldog)",
        },
        { value: "貴賓", label: "貴賓 (Poodle)" },
        { value: "比特", label: "比特 (Pit Bull)" },
        { value: "柴犬", label: "柴犬 (Shiba Inu)" },
        {
          value: "邊境牧羊",
          label: "邊境牧羊犬 (Border Collie)",
        },
      ]);
    } else if (newPetType === "cat") {
      setBreedOptions([
        { value: "", label: "不限種類" },
        { value: "混種貓", label: "米克斯 (Mixed)" },
        { value: "波斯貓", label: "波斯貓 (Persian)" },
        { value: "馬恩島貓", label: "馬恩島貓 (Manx)" },
        { value: "暹羅貓", label: "暹羅貓 (Siamese)" },
        {
          value: "蘇格蘭摺耳貓",
          label: "蘇格蘭摺耳貓 (Scottish Fold)",
        },
        { value: "緬因貓", label: "緬因貓 (Maine Coon)" },
        { value: "豹貓", label: "豹貓 (Bengal)" },
        {
          value: "俄羅斯藍貓",
          label: "俄羅斯藍貓 (Russian Blue)",
        },
        {
          value: "埃及毛貓",
          label: "埃及毛貓 (Egyptian Mau)",
        },
        { value: "布偶貓", label: "布偶貓 (Ragdoll)" },
      ]);
    } else {
      setBreedOptions([]); // Clear options if no pet type selected
    }