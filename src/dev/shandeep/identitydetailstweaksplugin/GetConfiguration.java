
package dev.shandeep.identitydetailstweaksplugin;

import sailpoint.rest.plugin.AllowAll;
import sailpoint.rest.plugin.BasePluginResource;
import sailpoint.tools.GeneralException;

import java.util.HashMap;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

/**
 * The REST resource for generating the announcement text from settings.
 *
 * @author Shandeep Srinivas <https://shandeep.dev>
 */
@Path("IdentityDetailsTweaks")
@Produces("application/json")
@Consumes("application/json")
public class GetConfiguration extends BasePluginResource {
	
    @Override
    public String getPluginName() {
        return "IdentityDetailsTweaks";
    }

    /**
     * Gets Announcement text from settings.
     *
     * @return The String containing the announcement.
     * @throws GeneralException
     */
    @GET
    @Path("getConfiguration")
    @AllowAll
    public Map<String, Object> getConfiguration() throws GeneralException {
        String appsToHide = getSettingString("appsToHide");
        boolean disableDetailsActionButton = getSettingBool("disableDetailsActionButton");
        boolean disableEntLinks = getSettingBool("disableEntLinks");
        Map<String, Object> result = new HashMap<String, Object>();
        result.put("appsToHide", appsToHide);
        result.put("disableDetailsActionButton", disableDetailsActionButton);
        result.put("disableEntLinks", disableEntLinks);
        return result;
    }

}

