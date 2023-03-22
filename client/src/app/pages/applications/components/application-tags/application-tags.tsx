import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Flex,
  Label,
  Spinner,
  TextContent,
  Text,
  Toolbar,
  ToolbarContent,
  ToolbarToggleGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";
import textStyles from "@patternfly/react-styles/css/utilities/Text/text";
import FilterIcon from "@patternfly/react-icons/dist/esm/icons/filter-icon";
import { ConditionalRender } from "@app/shared/components";
import { Application, Tag, TagCategory } from "@app/api/models";
import { getTagById, getTagCategoryById } from "@app/api/rest";
import {
  FilterCategory,
  FilterToolbar,
  FilterType,
} from "@app/shared/components/FilterToolbar";
import { useFilterState } from "@app/shared/hooks/useFilterState";
import { LabelCustomColor } from "@migtools/lib-ui";

interface TagWithSource extends Tag {
  source?: string;
}

const compareSources = (a: string, b: string) => {
  // Always put Manual tags (source === "") first
  if (a === "") return -1;
  if (b === "") return 1;
  return a.localeCompare(b);
};

export interface ApplicationTagsProps {
  application: Application;
}

export const ApplicationTags: React.FC<ApplicationTagsProps> = ({
  application,
}) => {
  const { t } = useTranslation();

  const [tags, setTags] = useState<TagWithSource[]>([]);
  const [tagCategoriesById, setTagCategoriesById] = useState<
    Map<number, TagCategory>
  >(new Map());

  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (application.tags) {
      setIsFetching(true);

      Promise.all(
        application.tags
          .map((f) => getTagById(f?.id || ""))
          .map((p) => p.catch(() => null))
      )
        .then((tags) => {
          const tagsWithSources = tags.reduce((prev, current, index) => {
            if (current) {
              const currentTagWithSource: TagWithSource = {
                ...current.data,
                source: application.tags?.[index].source,
              };
              return [...prev, currentTagWithSource];
            } else {
              // Filter out error responses
              return prev;
            }
          }, [] as Tag[]);
          const tagCategoryIds = new Set<number>();
          tagsWithSources.forEach(
            (tag) => tag.category?.id && tagCategoryIds.add(tag.category?.id)
          );
          Promise.all(
            Array.from(tagCategoryIds).map((tagCategoryId) =>
              getTagCategoryById(tagCategoryId)
            )
          ).then((tagCategories) => {
            // Tag categories
            const tagCategoryValidResponses = tagCategories.reduce(
              (prev, current) => {
                if (current) {
                  return [...prev, current.data];
                } else {
                  return prev;
                }
              },
              [] as TagCategory[]
            );

            const newTagCategoriesById = new Map<number, TagCategory>();
            tagCategoryValidResponses.forEach((tagCategory) =>
              newTagCategoriesById.set(tagCategory.id!, tagCategory)
            );

            setTags(tagsWithSources);
            setTagCategoriesById(newTagCategoriesById);

            setIsFetching(false);
          });
        })
        .catch(() => {
          setIsFetching(false);
        });
    } else {
      setTags([]);
      setTagCategoriesById(new Map());
    }
  }, [application]);

  const sources = new Set<string>();
  tags.forEach((tag) => sources.add(tag.source || ""));

  const filterCategories: FilterCategory<TagWithSource>[] = [
    {
      key: "source",
      title: t("terms.source"),
      type: FilterType.multiselect,
      placeholderText: t("terms.source"),
      getItemValue: (tag) => tag.source || "Manual",
      selectOptions: Array.from(sources)
        .sort(compareSources)
        .map((source) => source || "Manual")
        .map((source) => ({ key: source, value: source })),
      logicOperator: "OR",
    },
    {
      key: "tagCategory",
      title: t("terms.tagCategory"),
      type: FilterType.multiselect,
      placeholderText: t("terms.tagCategory"),
      getItemValue: (tag) => tag.category?.name || "",
      selectOptions: Array.from(tagCategoriesById.values())
        .map((tagCategory) => tagCategory.name)
        .sort((a, b) => a.localeCompare(b))
        .map((tagCategoryName) => ({
          key: tagCategoryName,
          value: tagCategoryName,
        })),
      logicOperator: "OR",
    },
  ];

  const {
    filterValues,
    setFilterValues,
    filteredItems: filteredTags,
  } = useFilterState(tags, filterCategories);

  const tagsBySource = new Map<string, Tag[]>();
  filteredTags.forEach((tag) => {
    const tagsInThisSource = tagsBySource.get(tag.source || "");
    if (tagsInThisSource) {
      tagsInThisSource.push(tag);
    } else {
      tagsBySource.set(tag.source || "", [tag]);
    }
  });

  return (
    <ConditionalRender when={isFetching} then={<Spinner isSVG size="md" />}>
      <Toolbar
        clearAllFilters={() => setFilterValues({})}
        clearFiltersButtonText={t("actions.clearAllFilters")}
      >
        <ToolbarContent className={spacing.p_0}>
          <ToolbarItem>Filter by:</ToolbarItem>
          <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
            <FilterToolbar<TagWithSource>
              filterCategories={filterCategories}
              filterValues={filterValues}
              setFilterValues={setFilterValues}
              showFiltersSideBySide
            />
          </ToolbarToggleGroup>
        </ToolbarContent>
      </Toolbar>

      {Array.from(tagsBySource.keys())
        .sort(compareSources)
        .map((source, tagSourceIndex) => {
          const tagsInThisSource = tagsBySource.get(source);
          const tagCategoriesInThisSource = new Set<TagCategory>();
          tagsInThisSource?.forEach((tag) => {
            const category =
              tag?.category?.id && tagCategoriesById.get(tag?.category?.id);
            category && tagCategoriesInThisSource.add(category);
          });
          return (
            <React.Fragment key={source}>
              <TextContent>
                <Text
                  component="h3"
                  className={`${spacing.mtSm} ${spacing.mbSm} ${textStyles.fontSizeMd}`}
                >
                  {source === "" ? "Manual" : source}
                </Text>
              </TextContent>
              {Array.from(tagCategoriesInThisSource).map((tagCategory) => {
                const tagsInThisCategoryInThisSource = tagsInThisSource?.filter(
                  (tag) => tag.category?.id === tagCategory.id
                );
                return (
                  <React.Fragment key={tagCategory.id}>
                    <TextContent>
                      <Text
                        component="h4"
                        className={`${spacing.mtSm} ${spacing.mbSm} ${textStyles.fontSizeSm} ${textStyles.fontWeightLight}`}
                      >
                        {tagCategory.name}
                      </Text>
                    </TextContent>
                    <Flex>
                      {tagsInThisCategoryInThisSource &&
                        tagsInThisCategoryInThisSource.map((tag) => {
                          const color =
                            tagCategoriesById.get(tag?.category?.id || 0)
                              ?.colour || "gray";
                          return (
                            <LabelCustomColor
                              key={tag.id}
                              color={color}
                              className={spacing.mXs}
                            >
                              {tag.name}
                            </LabelCustomColor>
                          );
                        })}
                    </Flex>
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          );
        })}
    </ConditionalRender>
  );
};
